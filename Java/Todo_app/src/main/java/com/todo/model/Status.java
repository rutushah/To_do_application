package com.todo.model;

public class Status {
    public int  id;
    public String status_name;
    public String display_name;

    public Status(int id, String status_name, String display_name){
        this.id = id;
        this.status_name = status_name;
        this.display_name = display_name;
    }

    //generating
    public int getId(){
        return id;
    }

    public String getStatus_name() {
        return status_name;
    }

    public String getDisplay_name() {
        return display_name;
    }
}
