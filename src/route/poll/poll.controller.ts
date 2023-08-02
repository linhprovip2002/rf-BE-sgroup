import {pollService} from "./"
import { Poll } from "../../model";
import crypto from 'crypto';
class pollController {
    async createPoll(req, res, next) {
        let id:number = crypto.randomBytes(1)[0] % 255;
        try {
            const newPoll: Poll = {
                id: id,
                user_id: req.userToken.id,
                name: req.body.name,
                question: req.body.question,
                created_at: new Date(Date.now()),
                options: req.body.options
            }
            const poll = await pollService.createPoll(newPoll);
            return res.status(200).json(poll);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllPolls(req, res, next) {
        try {
            const polls = await pollService.getAllPolls();
            return res.status(200).json(polls);
        }
        catch (err) {
            next(err);
        }
    }
    async getPollById(req, res, next) {
        try {
            const poll = await pollService.getPollById(req.params.id);
            return res.status(200).json(poll);
        }
        catch (err) {
            next(err);
        }
    }
    async deletePollById(req, res, next) {
        try {
            const poll = await pollService.deletePollById(req.params.id);
            if (poll === 0) {
                return res.status(404).json("poll not found");
            }
            return res.status(200).json("poll deleted");
        }
        catch (err) {
            next(err);
        }
    }
    async updatePoll(req, res, next) {
        try
        {   
            const newPoll: Poll = {
                id: req.params.id,
                user_id: req.userToken.id,
                name: req.body.name,
                question: req.body.question,
                created_at: new Date(Date.now()),
                options: req.body.options
            }
            const poll = await pollService.updatePoll(newPoll);
            if (poll === 0) {
                return res.status(404).json("poll not found");
            }
            return res.status(200).json("poll updated");
        } catch (err) {
            next(err);
        }
    }
}

export default new pollController();