export class Task {
  constructor(id, taskName, statusId, userId, categoryId, createdDate, updatedDate) {
    this.id = id;
    this.taskName = taskName;
    this.statusId = statusId;
    this.userId = userId;
    this.categoryId = categoryId;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
