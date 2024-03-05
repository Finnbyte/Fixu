import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import styles from "./CourseViewPage.module.scss";

export async function courseViewPageLoader({ params }: LoaderFunctionArgs) {
  const courseId = params["courseId"];
  return courseId;
}

export default function CourseViewPage() {
  const courseId = useLoaderData() as string;
  return (
    <div className={styles.page}>
      <p>{courseId}</p>
    </div>
  );
}
