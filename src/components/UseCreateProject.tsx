"use client";

import { useState, useCallback } from "react";
import CreateProjectModal from "./CreateProjectModal";

// Simple hook that controls whether the modal is open or closed.
// onCreated callback is gone — project creation now happens on the page,
// not in the modal, so there's nothing to callback about here.

export default function useCreateProject() {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const modal = open ? (
    <CreateProjectModal onClose={closeModal} />
  ) : null;

  return { openModal, modal };
}