/**
 * Task domain model representing user tasks
 * Stores task information including status, ownership, and categorization
 * Status IDs: 1=ready_to_pick, 2=in_progress, 3=blocked, 4=completed, 5=deleted
 * Category IDs: 1=work, 2=leisure
 */
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
