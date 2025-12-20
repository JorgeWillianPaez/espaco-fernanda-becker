"use client";

import React from "react";
import Image from "next/image";
import { maskPhone } from "@/app/utils/masks";
import styles from "./TeacherProfile.module.css";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  startDate: string;
  profileImage?: string;
}

interface TeacherProfileProps {
  teacher: Teacher;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({
  teacher,
  onPhotoUpload,
}) => {
  return (
    <div className={styles.teacherProfileSection}>
      <div className={styles.avatarWrapper}>
        <div
          className={styles.profileImageContainer}
          onClick={() =>
            document.getElementById("teacher-photo-upload")?.click()
          }
          style={{ cursor: "pointer" }}
        >
          {teacher.profileImage ? (
            <Image
              src={teacher.profileImage}
              alt={teacher.name}
              fill
              className={styles.profileImage}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className={styles.profileIconPlaceholder}>
              <i className="fas fa-user-circle"></i>
            </div>
          )}
          <input
            id="teacher-photo-upload"
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            style={{ display: "none" }}
          />
        </div>
        <div
          className={styles.cameraIconBadge}
          onClick={() =>
            document.getElementById("teacher-photo-upload")?.click()
          }
        >
          <i className="fas fa-camera"></i>
        </div>
      </div>
      <h2 className={styles.profileName}>{teacher.name}</h2>
      <p className={styles.profileClass}>{teacher.specialty}</p>
      <div className={styles.profileDetails}>
        <div className={styles.profileDetailItem}>
          <i className="fas fa-envelope"></i>
          <span>{teacher.email}</span>
        </div>
        <div className={styles.profileDetailItem}>
          <i className="fas fa-phone"></i>
          <span>{maskPhone(teacher.phone)}</span>
        </div>
        <div className={styles.profileDetailItem}>
          <i className="fas fa-calendar"></i>
          <span>Desde {teacher.startDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
