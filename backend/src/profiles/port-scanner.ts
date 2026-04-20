import net from 'net';
import pLimit from 'p-limit';
import { ScanResult } from "../models/scan-model";
import { User } from "../models/users-model";

export const profileInfoPortScanner = () => {
    return { profileName: 'port-scanner', severity: 'high', time: new Date().toISOString(), description: 'Scans for common open ports.' };
}

export const runPortScanner = async (target: string, email: string, scanGroupId: string) => {
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 8080, 8443];
    const profileName = "port-scanner";
    const limit = pLimit(5);

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const scanResultDoc = new ScanResult({
        target, profileName, scanGroupId, status: "pending", user: user._id, scanResult: { findings: [] }
    });
    await scanResultDoc.save();

    user.scans.push(scanResultDoc._id as any);
    await user.save();

    // Remove https:// or http:// from target for net socket
    const host = target.replace(/^https?:\/\//, '').split('/')[0];

    const scanPort = (port: number) => {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(2000); // 2 seconds timeout

            socket.on('connect', () => {
                socket.destroy();
                resolve({ port, status: 'open' });
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve({ port, status: 'closed' });
            });

            socket.on('error', () => {
                resolve({ port, status: 'closed' });
            });

            socket.connect(port, host);
        });
    };

    const results = await Promise.all(commonPorts.map(port => limit(() => scanPort(port))));
    const openPorts = results.filter((r: any) => r.status === 'open');

    scanResultDoc.status = "completed";
    scanResultDoc.scanResult = { findings: openPorts };
    await scanResultDoc.save();

    return { profileName, results: openPorts, scanId: scanResultDoc._id };
}
