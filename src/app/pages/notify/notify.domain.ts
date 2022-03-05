export class NotifyListDomain {
    id: number;
    title: string;
    content: string;
    date: string;
    time : string;

    constructor(id: number,
        title: string,
        content: string,
        date: string,
        time : string
    
    ) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.content = content;
        this.time = time;
    }
}