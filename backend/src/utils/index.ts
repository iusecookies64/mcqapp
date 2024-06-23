import client from "../models";

const contestCapacityQuery = `
  SELECT max_participants FROM contests WHERE contest_id=$1
  `;

const participantCountQuery = `
  SELECT COUNT(*) FROM participants WHERE contest_id=$1
  `;

export const isContestFull = async (contest_id: Number): Promise<boolean> => {
  // getting contest capacity
  const contestCapacityResult = await client.query(contestCapacityQuery, [
    contest_id,
  ]);
  // getting number of participants present
  const participantsCountResult = await client.query(participantCountQuery, [
    contest_id,
  ]);
  const contestCapacity = contestCapacityResult.rows[0]
    .max_participants as number;
  const participantCount = participantsCountResult.rowCount as number;

  return participantCount >= contestCapacity;
};
