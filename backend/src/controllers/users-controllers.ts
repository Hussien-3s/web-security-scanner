import { Request, Response } from "express";
import { User } from "../models/users-model";
import { Target } from "../models/target-model";
import { ScanResult } from "../models/scan-model";

export const addUser = async (req: Request, res: Response) => {
    const { username, email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ username, email, targets: [], scans: [], profiles: [] });
            await user.save();
        }
        res.json({ message: "User added successfully", data: user });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const getTargets = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }).populate('targets').lean();
        res.json({ message: "User targets get successfully", data: user });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const addTargets = async (req: Request, res: Response) => {
    const { target, description, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTarget = new Target({ target, description, user: user._id });
        await newTarget.save();

        user.targets.push(newTarget._id as any);
        await user.save();

        res.json({ message: "User targets added successfully", data: newTarget });
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
        console.log(e);
    }
};

export const deleteTargets = async (req: Request, res: Response) => {
    const { target, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find the target to delete
        const targetDoc = await Target.findOne({ target, user: user._id });
        if (!targetDoc) return res.status(404).json({ message: "Target not found" });

        await Target.deleteOne({ _id: targetDoc._id });
        user.targets = user.targets.filter(tId => tId.toString() !== (targetDoc._id as any).toString());
        await user.save();

        res.json({ message: "Deleted successfully" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};
