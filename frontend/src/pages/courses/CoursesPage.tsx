import styles from "./CoursesPage.module.scss";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useRef } from "react";
import { useGetCoursesQuery, useGetEnrolledCoursesQuery, useUpdateEnrollmentStatusMutation } from "../../slices/api";

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
        {title}
        <br/>
        {description}
      </div>
      <button onClick={() => onMembershipUpdate(isEnrolled ? "leave" : "join")}>
        {isEnrolled ? "Leave course" : "Join course"}
      </button>
    </div>
  )
}

export default function CoursesPage() {
  const user = useAppSelector((state) => state.user.data!);
  console.log("rerendered");
  const { data: courses } = useGetCoursesQuery();
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery(user.id);
  const [updateEnrollment] = useUpdateEnrollmentStatusMutation();

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
      {courses.map((course) => {
        const { id, name, description } = course;
        const isEnrolled = enrolledCourses.includes(course.id);
        return (
          <Course
            key={id}
            title={name}
            description={description}
            isEnrolled={isEnrolled}
            onMembershipUpdate={(status) => {
              console.log({ status, userId: user.id, courseId: id });
              updateEnrollment({ status, userId: user.id, courseId: id });
            }}
          />
        );
      })}
    </div>
  );
}
