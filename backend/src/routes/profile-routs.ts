import express from "express";
import { fuzzingDirectories } from "../profiles/fuzzing-routes.ts";
import { runPortScanner } from "../profiles/port-scanner.ts";
import { runHeadersScanner } from "../profiles/headers-scanner.ts";
import { readProfiles } from "../profiles/read-profiles.ts";
import { User } from "../models/users-model.ts";
import { ScanResult } from "../models/scan-model.ts";

const profileRouter = express.Router();

profileRouter.post("/startScan", async (req, res) => {
    const { target, email, profileName } = req.body;
    if (!target || !email || !profileName) {
        return res.status(400).json({ error: "Target, email, and profileName are required" });
    }
    try {
        let results;
        if (profileName === 'port-scanner') {
             results = await runPortScanner(target as string, email as string);
        } else if (profileName === 'headers-scanner') {
             results = await runHeadersScanner(target as string, email as string);
        } else {
             results = await fuzzingDirectories(target as string, email as string);
        }
        res.json({ results });
    } catch (error: any) {
        console.error("Scan error:", error);
        res.status(500).json({ error: error.message || "Scan failed" });
    }
});

profileRouter.post("/addScan", async (req, res) => {
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
});

profileRouter.post("/getScans", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }).populate('scans').lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ scans: user.scans });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

profileRouter.get("/profiles", (req, res) => {
    try {
        const results = readProfiles();
        res.json(results);
    } catch (error) {
        console.error("Profiles error:", error);
        res.status(500).json({ error: "Failed to read profiles" });
    }
});

export default profileRouter;