import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { NotAuthenticatedCard } from "@/features/errors/NotAuthenticatedCard";
import { getAuthSession } from "@/lib/auth";
import { CourseCard } from "../courses/CourseCard";
import { getCourses } from "../courses/course.query";

export default async function CoursesPage() {
  const session = await getAuthSession();

  if (!session?.user.id) {
    return <NotAuthenticatedCard />;
  }

  const courses = await getCourses(session.user.id);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Your courses</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
      </LayoutContent>
    </Layout>
  );
}
