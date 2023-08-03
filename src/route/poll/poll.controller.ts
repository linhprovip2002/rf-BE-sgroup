import { pollService } from "./"
import { Option, Poll } from "../../model";
import crypto from 'crypto';
class pollController {
    async createPoll(req, res, next) {
        let id: number = crypto.randomBytes(1)[0] % 255;
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
        try {
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
    async votePoll(req, res, next) {
        try {
            const check = await pollService.checkVoteInPoll(req.userToken.id, req.params.idPoll);
            if (check) {
                return res.status(400).json("user already voted in this poll");
            }
            const poll = await pollService.votePoll(req.userToken.id, req.params.idOption);
            if (poll === 0) {

                return res.status(404).json("poll not found");
            }
            return res.status(200).json("poll updated");
        } catch (err) {
            next(err);
        }
    }
    async unVotePoll(req, res, next) {
        try {
            const poll = await pollService.unVotePoll(req.userToken.id, req.params.idOption);
            if (poll === 0) {
                return res.status(404).json("poll not found");
            }
            return res.status(200).json("poll unvote success");
        } catch (err) {
            next(err);

        }
    }
    async internOption(req, res, next) {
        try { 
            let id: number = crypto.randomBytes(1)[0] % 255;
             const option:Option = 
             {
                    option_id: id,
                    poll_id: req.params.id,
                    option_text: req.body.option_text,
                    array_votes: []
             }
             const poll = await pollService.insertOption(option);
                if (poll === 0) {
                    return res.status(404).json("poll not found");
                }
                return res.status(200).json("option intern success");
        } catch(err)
        {
            next(err);
        }
    }
    async deleteOption(req, res, next) {
        try {
            const poll = await pollService.deleteOption(req.params.id);
            if (poll === 0) {
                return res.status(404).json("poll not found");
            }
            return res.status(200).json("option deleted");
        }
        catch (err) {
            next(err);
        }
    }
}

export default new pollController();