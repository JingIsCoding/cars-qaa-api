import uuid from 'uuid/v4'

export default class Question{
    constructor(id, title, content, author, votes, views, createTime, modifyTime){
        this.id = id ? id : uuid();
        this.title = title
        this.content = content
        this.author = author
        this.votes = votes;
        this.views = views ? views : 0;
        this.createTime = createTime ? createTime : new Date();
        this.modifyTime = modifyTime ? modifyTime : new Date();
    }

    views(){
        return this.views
    }

    editTitle(title){
        this.title = title
    }

    editContent(content){
        this.content = content;
    }

    vote(){
        this.votes = this.votes ? this.votes + 1 : 1;
    }
}