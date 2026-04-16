import axios from 'axios';
import { ScanResult } from "../models/scan-model.ts";
import { User } from "../models/users-model.ts";

export const profileInfoHeadersScanner = () => {
    return { profileName: 'headers-scanner', severity: 'medium', time: new Date().toISOString(), description: 'Checks for standard security headers.' };
}

export const runHeadersScanner = async (target: string, email: string) => {
    const profileName = "headers-scanner";
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const scanResultDoc = new ScanResult({
        target, profileName, status: "pending", user: user._id, scanResult: { findings: [] }
    });
    await scanResultDoc.save();

    user.scans.push(scanResultDoc._id as any);
    await user.save();

    const formattedTarget = target.startsWith('http') ? target : `https://${target}`;
    let findings: any[] = [];
    
    try {
        const response = await axios.get(formattedTarget, { validateStatus: () => true, timeout: 5000 });
        const headers = response.headers as Record<string, string>;
        
        const securityHeaders = [
            'strict-transport-security',
            'x-frame-options',
            'x-content-type-options',
            'content-security-policy',
            'x-xss-protection'
        ];
        
        for (const header of securityHeaders) {
            findings.push({ 
                header, 
                missing: !headers[header],
                value: headers[header] || null
            });
        }
    } catch (error) {
        findings.push({ error: 'Failed to fetch target headers', details: String(error) });
    }

    scanResultDoc.status = "completed";
    scanResultDoc.scanResult = { findings };
    await scanResultDoc.save();

    return { profileName, results: findings, scanId: scanResultDoc._id };
}
