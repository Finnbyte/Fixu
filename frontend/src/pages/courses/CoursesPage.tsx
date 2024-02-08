import styles from "./CoursesPage.module.scss";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useRef } from "react";
import { useGetCoursesQuery, useGetEnrolledCoursesQuery } from "../../slices/api";

interface CourseProps {
  title: string;
  description: string;
  isEnrolled: boolean;
  onMembershipUpdate: (type: "join" | "leave") => void;
}

function Course({ title, description, isEnrolled, onMembershipUpdate }: CourseProps) {
  return (
    <div className={styles.course}>
      <img />
      <div className={styles["information-container"]}>
        <h2>{title}</h2>
        <br/>
        {description}
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const user = useAppSelector((state) => state.user.data!);
  const { data: courses } = useGetCoursesQuery();
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery(user.id);

  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!courses || !enrolledCourses) {
    return null;
  }

  return (
    <div className={styles.page}>
      <dialog ref={dialogRef}>
        <p>Moroo:)</p>
      </dialog>
      {user?.privilege === "admin" && (
        <button onClick={() => dialogRef.current?.showModal()}>
          Create a course
        </button>
      )}
      <div className={styles["courses-container"]}>
        {courses.map((course) => {
          return (
            <Course
              key={id}
              title={name}
              description={description}
            />
          );
        })}
      </div>
    </div>
  );
}
