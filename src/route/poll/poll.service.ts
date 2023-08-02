import poolKnex from "../../config/knex";
import { Poll } from "../../model";
class pollService {
  async createPoll(Poll: Poll) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const [pollID] = await trx('poll').insert({
            user_id: Poll.user_id,
            name: Poll.name,
            question: Poll.question,
            createdAt: Poll.created_at
          });
          //  console.log(Poll.options)
          const optionRecords = Poll.options.map((option) => ({
            poll_id: pollID,
            option_text: option
          }));

          await trx('option').insert(optionRecords);
          await trx.commit();

          resolve(Poll);
        } catch (error) {
          console.log(error);
          await trx.rollback();
          reject(error);
        }
      });
    });
  }
  async getAllPolls() {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const polls = await trx('poll').select('*');
          resolve(polls);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    });
  }
  async getPollById(id: number) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const poll = await trx('poll').select('*').where('poll_id', id).first();
          const options = await trx('option').select('*').where('poll_id', id);
          poll.options = options.map((option) => option.option_text);
          resolve(poll);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    });
  }
  async deletePollById(id: number) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          await trx('poll').select('*').where('poll_id', id).first();
          await trx('poll').delete().where('poll_id', id);
          resolve(true);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      })
    });
  }
  async updatePoll(poll: Poll) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const [updatedPoll] = await trx('poll').update({
            user_id: poll.user_id,
            name: poll.name,
            question: poll.question,
            createdAt: poll.created_at
          }).where('poll_id', poll.id).returning('*');
          const options = poll.options.map((option) => ({
            poll_id: poll.id,
            option_text: option
          }));
          await trx('option').delete().where('poll_id', poll.id);
          await trx('option').insert(options);
          resolve(updatedPoll);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    });
  }
}

export default new pollService();