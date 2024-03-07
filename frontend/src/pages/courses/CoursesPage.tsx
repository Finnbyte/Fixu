import styles from "./CoursesPage.module.scss";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useGetCoursesQuery, useGetEnrolledCoursesQuery, useUpdateEnrollmentStatusMutation } from "../../slices/api";
import { format } from "date-fns";
import "../../_common.scss";
import { MoreVertical } from "react-feather";
import { Spinner, Button, List, DropButton, Box } from "grommet";

interface CourseProps {
  id: string;
  name: string;
  isEnrolled: boolean;
  description: string;
  createdAt: Date;
  endedAt: Date | null;
  onView: () => void;
}

function CourseCard({ id, name, description, createdAt, endedAt, isEnrolled, onView }: CourseProps) {
  const userId = useAppSelector((state) => state.user.data!.id);
  const [updateEnrollment, { isLoading }] = useUpdateEnrollmentStatusMutation();

  function handleEnrollmentChange() {
    const newIsEnrolled = !isEnrolled
    updateEnrollment({ status: newIsEnrolled ? "join" : "leave", userId, courseId: id });
  }

  function formatDate(date: Date) {
    return format(date, "dd MMMM yyyy");
  }

  return (
    <div className={styles.course}>
      <img />
      <div className={styles["information-container"]}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2>{name}</h2>
          <DropButton
            icon={<MoreVertical size={28} cursor={"pointer"} />}
            dropAlign={{ top: "bottom", left: "left" }}
            dropContent={
              <Box background="rgba(52, 52, 52, 1)">
                <List
                  primaryKey="label"
                  border={false}
                  defaultItemProps={{ onClick: handleEnrollmentChange, hoverIndicator: { color: "blue" } }}
                  data={[
                    { label: isEnrolled ? "Leave" : "Join" }
                  ]}
                >
                  {({ label }, index) => (
                    <Box>
                      {index === 0 && isLoading
                        ? <Spinner />
                        : label}
                    </Box>
                  )}
                </List>
              </Box>
            }
          />
        </div>
        <br />
        {description || "No description"}
        <br /><br />
        <span style={{ opacity: "0.55", fontWeight: "bold" }}>{formatDate(createdAt)} - {`${endedAt && formatDate(endedAt)}`}</span>
      </div>
      <div style={{ display: "inline-block", marginLeft: "auto" }}>
        <Button primary onClick={() => onView()} label="View" />
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const user = useAppSelector((state) => state.user.data!);
  const navigate = useNavigate();
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
            <CourseCard
              key={course.id}
              onView={() => navigate(`${course.id}`, { relative: "path" })}
              isEnrolled={enrolledCourses.includes(course.id)}
              {...course}
            />
          );
        })}
      </div>
    </div>
  );
}
