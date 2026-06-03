"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

type AddTaskModalProps = {
  onClose: () => void;
  onAdd: (task: { label: string; priority: "high" | "medium" | "low"; dueDate: string; tags: string[] }) => void;
};

//onClose is a function passed in that closes the modal
//onAdd is a function passed in that adds a new task
export default function AddTaskModal({ onClose, onAdd }: AddTaskModalProps) {
  //label starts as an empty string and we can use setLabel to update it when the user types in an input
  const [label, setLabel] = useState("");
  //priority defaults to low and we call setPriority when the user changes it
  const [priority, setPriority] = useState<"high" | "medium" | "low">("low");
  //same with dueDate and tagsInput
  const [dueDate, setDueDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  //function that runs when the user clicks Add
  const handleSubmit = () => {
    //if empty or only spaces, do nothing
    if (!label.trim()) return;
    //sets tags to be an array from the tagsInput line
    const tags = tagsInput
      .split(",")  //this is splitting each tag to be in an array by the commas
      .map((t) => t.trim()) //maps each tag to be trimmed
      .filter(Boolean); //removes any empty string (by converting the strings to true or false and filtering out the false ones)
    //calls the onAdd function from props with an "task" object containing the trimmed label, priority, dueDate, and tags"
    onAdd({ label: label.trim(), priority, dueDate, tags });
    //closes the model after adding
    onClose();
  };

  return (
    //outer container (the overlay)
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} //clicking anywhere on the overlay will close the modal
    >
      {/* inner container (the modal box) */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header shows the title add new task*/}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Add new task</h2>
          {/* close button that when clicked on, it calls the onClose prop that closes that modal */}
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Task name  input*/}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Task name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Finish the report..."
              //the inputs value comes from React state, meaning the text inside this input should always equal the label state
              value={label}
              //on every change of the input, react calls setLbael and re-renders the input 
              onChange={(e) => setLabel(e.target.value)} // so now value ={label} matches the new state
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} //hitting enter triggers the handleSubmit function
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Priority + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Priority</label>
              {/*shows the current default priority and allows u to change it through the select input*/}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Due date</label>
                {/*shows the current default due date thats empty and allows u to change it through the date selector input*/}
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Labels <span className="text-gray-400 dark:text-gray-500">(comma separated)</span>
            </label>
            {/* user can store comma-seperated labels thats. stores in tagsInput state */}
            <input
              type="text"
              placeholder="e.g. career, coding, life"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-1">
            {/* cancel button taht when clicked it calls onClose() to hide the modal */}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>

            {/* add task button when clicked it calls the handleSubmit function */}
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}