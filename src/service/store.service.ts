// import { FeedbackM } from "../models/feedback.model";
// import { FeedbackI } from "../types/feedback";

// export async function createFeedback(
//   destinationId: string,
//   feedback_text: string,
//   left_by: string
// ): Promise<FeedbackI> {
//   try {
//     const feedback = new FeedbackM({
//       destination_id: destinationId,
//       feedback_text,
//       left_by,
//     });

//     return await feedback.save();
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function getFeedbacks(
//   destinationId: string
// ): Promise<FeedbackI[]> {
//   try {
//     return await FeedbackM.find({ destination_id: destinationId });
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }

// export async function deleteFeedback(id: string): Promise<FeedbackI | null> {
//     try {
//       return await FeedbackM.findByIdAndDelete(id);
//     } catch (e: any) {
//       throw new Error(e);
//     }
//   }
