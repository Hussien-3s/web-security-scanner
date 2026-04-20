import { Request, Response } from "express";
import { fuzzingDirectories } from "../profiles/fuzzing-routes";
import { runPortScanner } from "../profiles/port-scanner";
import { runHeadersScanner } from "../profiles/headers-scanner";
import { readProfiles } from "../profiles/read-profiles";
import { User } from "../models/users-model";
import { ScanResult } from "../models/scan-model";
import crypto from "crypto";

export const startScan = async (req: Request, res: Response) => {
    const { target, email, profiles } = req.body;
    if (!target || !email || !profiles) {
        return res.status(400).json({ error: "Target, email, and profiles are required" });
    }
    const scanGroupId = crypto.randomUUID();
    try {
        let results = [];
        if (profiles.includes('port-scanner')) {
            results.push(await runPortScanner(target as string, email as string, scanGroupId));
        }
        if (profiles.includes('headers-scanner')) {
            results.push(await runHeadersScanner(target as string, email as string, scanGroupId));
        }
        if (profiles.includes('fuzzing')) {
            results.push(await fuzzingDirectories(target as string, email as string, scanGroupId));
        }
        res.json({ results, scanGroupId });
    } catch (error: any) {
        console.error("Scan error:", error);
        res.status(500).json({ error: error.message || "Scan failed" });
    }
};

export const addScan = async (req: Request, res: Response) => {
    const { target, scanResult, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newScan = new ScanResult({
            target,
            profileName: "custom",
            scanResult,
            status: "completed",
            user: user._id
        });
        await newScan.save();

        user.scans.push(newScan._id as any);
        await user.save();

        res.json({ message: "User scans added successfully", data: newScan });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getScans = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }).populate('scans').lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ scans: user.scans });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getTargetScans = async (req: Request, res: Response) => {
    const { email, target } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const scans = await ScanResult.find({
            user: user._id,
            target: target
        }).sort({ createdAt: -1 });

        res.json({ scans });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteScan = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const scan = await ScanResult.findById(id);
        if (!scan) return res.status(404).json({ error: "Scan not found" });

        await User.findByIdAndUpdate(scan.user, {
            $pull: { scans: scan._id }
        });

        await ScanResult.findByIdAndDelete(id);

        res.json({ message: "Scan deleted successfully" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteScanGroup = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    try {
        const scans = await ScanResult.find({ scanGroupId: groupId });
        if (scans.length === 0) return res.status(404).json({ error: "No scans found for this group" });

        const userId = scans[0].user;
        const scanIds = scans.map(s => s._id);

        await User.findByIdAndUpdate(userId, {
            $pull: { scans: { $in: scanIds } }
        });

        await ScanResult.deleteMany({ scanGroupId: groupId });

        res.json({ message: "Scan group deleted successfully" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getProfiles = (req: Request, res: Response) => {
    try {
        const results = readProfiles();
        res.json(results);
    } catch (error) {
        console.error("Profiles error:", error);
        res.status(500).json({ error: "Failed to read profiles" });
    }
};
