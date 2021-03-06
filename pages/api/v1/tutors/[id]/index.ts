// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from "lib/database/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    if (req.method !== "GET") {
        res.status(405).json({status: "method not allowed"});
        return;
    }
    const {id} = req.query;
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        res.status(400).json({status: "bad request"});
        return;
    }
    let result: {
        id: string,
        firstName: string | null,
        lastName: string | null,
        fatherName: string | null,
        updated: Date,
        nickName: string | null,
        legacyRating: number,
        rating: number,
        reviewsCount: number,
        materialsCount: number,
        url: string | null,
    }[] = await prisma.$queryRaw`
SELECT
"Tutor".id as id,
"firstName",
"lastName",
"fatherName",
"updated",
"nickName",
(COALESCE("LegacyRating"."exams" / CAST(NULLIF("LegacyRating"."examsCount", 0) AS FLOAT), 0.0) + COALESCE("LegacyRating".quality / CAST(NULLIF("LegacyRating"."qualityCount", 0) AS FLOAT), 0.0) + COALESCE("LegacyRating".personality / CAST(NULLIF("LegacyRating"."personalityCount", 0) AS FLOAT), 0.0)) / 3 AS "legacyRating",
IFNULL(AVG("Rate".quality), 0) AS quality,
IFNULL(AVG("Rate".exams), 0) AS exams,
IFNULL(AVG("Rate".personality), 0) AS personality,
IFNULL(AVG("Rate".punctuality), 0) AS punctuality,
COUNT("Review".id) as "reviewsCount",
COUNT("Material".id) as "materialsCount",
IF(COUNT("File".id) > 0, ARRAY_AGG("File".url), '{}') as images,
IF(COUNT("Discipline".name) > 0, ARRAY_AGG("Discipline".name), '{}') as disciplines,
IF(COUNT("Faculty".name) > 0, ARRAY_AGG("Faculty".name), '{}') as faculties
FROM "Tutor"
LEFT JOIN "LegacyRating"
ON
"LegacyRating"."tutorId" = "Tutor".id
LEFT JOIN "Rate"
ON
"Rate"."tutorId" = "Tutor".id
LEFT JOIN "Review"
ON
"Review"."tutorId" = "Tutor".id
LEFT JOIN "Material"
ON
"Material"."tutorId" = "Tutor".id
LEFT JOIN "File"
ON
"File"."tutorId" = "Tutor".id
LEFT JOIN "_FacultyToTutor"
ON
"_FacultyToTutor"."B" = "Tutor".id
LEFT JOIN "Faculty"
ON
"_FacultyToTutor"."A" = "Faculty".id
LEFT JOIN "_DisciplineToTutor"
ON
"_DisciplineToTutor"."B" = "Tutor".id
LEFT JOIN "Discipline"
ON
"_DisciplineToTutor"."A" = "Discipline".id
WHERE "Tutor".id = ${id}
GROUP BY "Tutor".id, "LegacyRating"."exams", "LegacyRating"."examsCount", "LegacyRating"."quality", "LegacyRating"."qualityCount", "LegacyRating"."personality", "LegacyRating"."personalityCount"
`

    result = result.map(item => {
        item.legacyRating = Number(item.legacyRating.toFixed(2))
        item.reviewsCount = Number(item.reviewsCount)
        item.materialsCount = Number(item.materialsCount)
        return item
    });
    if(result[0] === undefined) {
        res.status(404).json({status: "not found"});
        return;
    }

    res.status(200).json(result[0]);
}
