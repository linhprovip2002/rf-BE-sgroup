import poolKnex from "../../config/knex";
import { Poll, Option } from "../../model";
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
    // return new Promise((resolve, reject) => {
    //   poolKnex.transaction(async (trx) => {
    //     try {
    //       const poll: Poll = await trx('poll').select('*').where('poll_id', id).first();
    //       const options = await trx('option').select('*').where('poll_id', id);
    //       poll.options = options.map((option) => 
    //       {
    //           option.option_id,
    //           option.poll_id,
    //           option.option_text,
    //           option.array_votes = trx('votes').select(('GROUP_CONCAT(user_id) as userIDs'))
    //           .where('option_id', option.option_id)
    //       });
    //       resolve(poll);
    //     } catch (error) {
    //       console.log(error);
    //       reject(error);
    //     }
    //   });
    // });
    return new Promise<Poll>((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const poll: Poll = await trx('poll').select('*').where('poll_id', id).first();
          const options: Option[] = await trx('option').select('*').where('poll_id', id);

          // Get the votes for each option
          const optionIds = options.map((option) => option.option_id);
          const votesPromiseArray = optionIds.map((optionId) => {
            return trx('votes').select('user_id').where('option_id', optionId);
          });
          const votesArray = await Promise.all(votesPromiseArray);
          const array_votes = votesArray.map((votes) => votes.map((vote) => vote.user_id));

          poll.options = options.map((option, index) => {
            return {
              ...option,
              array_votes: array_votes[index],
            };
          });

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
  async checkVoteInPoll(idUser: number, idPoll: number) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const options = await trx('option').select('*').where('poll_id', idPoll);
          const optionIds = options.map((option) => option.option_id);
          const votesPromiseArray = optionIds.map((optionId) => {
            return trx('votes').select('user_id').where('option_id', optionId);
          });
          const votesArray = await Promise.all(votesPromiseArray);
          const array_votes = votesArray.map((votes) => votes.map((vote) => vote.user_id));
          const vote = array_votes.some((array) => array.includes(idUser));
          console.log(vote);
          resolve(vote);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    });
  }

  async votePoll(idUser: number, idOption: number) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const [vote] = await trx('votes').insert({
            user_id: idUser,
            option_id: idOption
          });
          resolve(vote);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
      );
    })
  }
  async unVotePoll(idUser: number, idOption: number) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const vote = await trx('votes').delete().where('user_id', idUser).andWhere('option_id', idOption);
          resolve(vote);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
      );
    })
  }
  async insertOption(options: Option) {
     return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const [option] = await trx('option').insert({
            poll_id: options.poll_id,
            option_text: options.option_text
          });
          resolve(option);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
      );
    })

  }
  async deleteOption(idOption: number) {
    return new Promise((resolve, reject) => {
      poolKnex.transaction(async (trx) => {
        try {
          const option = await trx('option').delete().where('option_id', idOption);
          resolve(option);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      })
    });
  }
}

export default new pollService();