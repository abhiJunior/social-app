import { Router } from "express";
import { follow,unfollow,getFollowers,getFollowing} from "../controller/followController.js";


const router = Router();


router.post("/:id/follow",follow)

router.post("/:id/unfollow",unfollow)

router.get("/:id/followers",getFollowers)

router.get("/:id/following",getFollowing)

export default router