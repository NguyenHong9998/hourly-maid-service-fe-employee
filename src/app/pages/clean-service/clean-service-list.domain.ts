export class CleanServiceListDomain {
    id: number;
    position: number;
    name: string;
    banner: string;
    price: string;
    note: string;
    createDate: string;
    status : string;

    constructor(id: number, position: number, name: string, banner: string, price: string, note: string, createDate: string, status : string) {
        this.id = id;
        this.position = position;
        this.name = name;
        this.banner = banner;
        this.price = price;
        this.note = note;
        this.createDate = createDate;
        this.status = status;
    }

}