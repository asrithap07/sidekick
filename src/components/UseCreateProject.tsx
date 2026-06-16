"use client";

import { useState, useCallback } from "react";
import CreateProjectModal from "./CreateProjectModal";
import type { ProjectDraft } from "./CreateProjectModal";

export default function useCreateProject(onCreated?: (draft: ProjectDraft) => void) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const modal = open ? (
    <CreateProjectModal
      onClose={closeModal}
      onCreated={(draft) => {
        onCreated?.(draft);
        closeModal();
      }}
    />
  ) : null;

  return { openModal, modal };
}