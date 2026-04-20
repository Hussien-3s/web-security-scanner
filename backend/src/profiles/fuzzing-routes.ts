import axios from "axios";
import fs from 'node:fs';
import pLimit from "p-limit";
import { ScanResult } from "../models/scan-model";
import { User } from "../models/users-model";

const wordlistPath = './src/wordlist/Directories_All.txt';
const profileName = "fuzzing"

const readWordlist = (): string[] => {
    if (!fs.existsSync(wordlistPath)) {
        console.warn(`Wordlist file not found at ${wordlistPath}`);
        return [];
    }
    const data = fs.readFileSync(wordlistPath, 'utf-8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

export const fuzzingDirectories = async (target: string, email: string, scanGroupId: string) => {
    const wordlist = readWordlist();
    const limit = pLimit(20);

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    // Create a pending scan result
    const scanResultDoc = new ScanResult({
        target,
        profileName,
        scanGroupId,
        status: "pending",
        user: user._id,
        scanResult: { findings: [] }
    });
    await scanResultDoc.save();

    user.scans.push(scanResultDoc._id as any);
    await user.save();

    const results = await Promise.all(wordlist.map(word => limit(async () => {
        const url = `https://${target}/${word}`;
        try {
            const response = await axios.get(url, { validateStatus: () => true, timeout: 5000 });
            return { word, url, exploit: { node: `go to ${url}` }, status: response.status };
        } catch (error: any) {
            return { word, url, status: error.response?.status || 500 };
        }
    })));

    const filterResults = results.filter(result => result.status == 200 || result.status == 403 || result.status == 301);

    scanResultDoc.status = "completed";
    scanResultDoc.scanResult = { findings: filterResults };
    await scanResultDoc.save();

    return { profileName, results: filterResults, scanId: scanResultDoc._id };
}

export const profileInfo = () => {
    return { profileName: 'fuzzing', severity: 'none', time: new Date().toISOString(), description: 'Fuzzing directories' };
}
