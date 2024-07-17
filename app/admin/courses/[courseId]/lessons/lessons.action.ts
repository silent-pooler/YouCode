"use server";

import { ActionError, authActionClient } from "@/lib/action";
import { getTheMiddleRank } from "@/lib/getTheMiddleRank";
import prisma from "@/lib/prisma";
import { z } from "zod";

const SaveLessonMoveSchema = z.object({
  data: z.object({
    upItemRank: z.string().optional(),
    downItemRank: z.string().optional(),
    lessonId: z.string(),
  }),
});

export const saveLessonMove = authActionClient
  .metadata({ actionName: "saveLessonMove" })
  .schema(SaveLessonMoveSchema)
  .action(async ({ parsedInput: { data }, ctx: { userId } }) => {
    const course = await prisma.course.findFirst({
      where: {
        lessons: {
          some: {
            id: data.lessonId,
          },
        },
        creatorId: userId,
      },
    });

    if (!course) {
      throw new ActionError("This course doesn't exist");
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: data.lessonId,
        courseId: course.id,
      },
    });

    if (!lesson) {
      throw new ActionError("This lesson doesn't exist");
    }

    const newRank = getTheMiddleRank(data.upItemRank, data.downItemRank);

    await prisma.lesson.update({
      where: {
        id: data.lessonId,
      },
      data: {
        rank: newRank,
      },
    });

    return newRank;
  });

// export const saveLessonMove1 = authenticatedAction(
//   SaveLessonMoveSchema,
//   async (data, { userId }) => {
//     const course = await prisma.course.findFirst({
//       where: {
//         lessons: {
//           some: {
//             id: data.lessonId,
//           },
//         },
//         creatorId: userId,
//       },
//     });

//     if (!course) {
//       throw new ActionError("This course doesn't exist");
//     }

//     const lesson = await prisma.lesson.findFirst({
//       where: {
//         id: data.lessonId,
//         courseId: course.id,
//       },
//     });

//     if (!lesson) {
//       throw new ActionError("This lesson doesn't exist");
//     }

//     const newRank = getTheMiddleRank(data.upItemRank, data.downItemRank);

//     await prisma.lesson.update({
//       where: {
//         id: data.lessonId,
//       },
//       data: {
//         rank: newRank,
//       },
//     });

//     return newRank;
//   }
// );
