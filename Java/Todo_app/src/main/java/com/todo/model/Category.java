package com.todo.model;

public class Category {
    public int  id;
    public String category_name;
    public String display_name;

    public Category(int id, String category_name, String display_name){
        this.id = id;
        this.category_name = category_name;
        this.display_name = display_name;
    }

    //generated getter methods for category
    public int getId() {
        return id;
    }

    public String getCategory_name() {
        return category_name;
    }

    public String getDisplay_name() {
        return display_name;
    }
}
