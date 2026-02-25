import { Response } from "express";
import { AuthRequest } from "../middlwares/auth.js";
import Thumbnail from "../models/Thumbnail.js";

/* ---------------- GET ALL USER THUMBNAILS ---------------- */
export const getUsersThumbnails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });

    res.json({ thumbnails });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET SINGLE THUMBNAIL ---------------- */
export const getThumbnailbyId = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const thumbnail = await Thumbnail.findOne({
      _id: id,
      userId,
    });

    if (!thumbnail) {
      return res.status(404).json({
        message: "Thumbnail not found",
      });
    }

    res.json({ thumbnail });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
