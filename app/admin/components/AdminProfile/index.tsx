"use client";

import React from "react";
import Image from "next/image";
import { maskPhone } from "@/app/utils/masks";
import styles from "./AdminProfile.module.css";

interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  roleId?: number;
  profileImage?: string;
}

interface AdminProfileProps {
  user: User | null;
  onPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ user, onPhotoUpload }) => {
  if (!user) return null;

  const getRoleName = (roleId?: number) => {
    switch (roleId) {
      case 1:
        return "Administrador";
      case 2:
        return "Professor";
      case 3:
        return "Aluno";
      default:
        return "Usuário";
    }
  };

  return (
    <div className={styles.adminProfileSection}>
      <div className={styles.avatarWrapper}>
        <div
          className={styles.profileImageContainer}
          onClick={() =>
            onPhotoUpload &&
            document.getElementById("admin-photo-upload")?.click()
          }
          style={{ cursor: onPhotoUpload ? "pointer" : "default" }}
        >
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name}
              fill
              className={styles.profileImage}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className={styles.profileIconPlaceholder}>
              <i className="fas fa-user-circle"></i>
            </div>
          )}
          {onPhotoUpload && (
            <input
              id="admin-photo-upload"
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              style={{ display: "none" }}
            />
          )}
        </div>
        {onPhotoUpload && (
          <div
            className={styles.cameraIconBadge}
            onClick={() =>
              document.getElementById("admin-photo-upload")?.click()
            }
          >
            <i className="fas fa-camera"></i>
          </div>
        )}
      </div>
      <h2 className={styles.profileName}>{user.name}</h2>
      <p className={styles.profileRole}>{getRoleName(user.roleId)}</p>
      <div className={styles.profileDetails}>
        <div className={styles.profileDetailItem}>
          <i className="fas fa-envelope"></i>
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className={styles.profileDetailItem}>
            <i className="fas fa-phone"></i>
            <span>{maskPhone(user.phone)}</span>
          </div>
        )}
        <div className={styles.profileDetailItem}>
          <i className="fas fa-calendar"></i>
          <span>Membro desde 2024</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
