import express from "express";

const allStudents = (req, res) => {
  res.send("All students");
};

const newStudent = (req, res) => {
  res.send("New student Created!");
};

export { allStudents, newStudent };
