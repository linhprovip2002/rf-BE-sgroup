import { Option } from "./index";

interface Poll {
    id : number;
    name: string;
    question: string;
    user_id: number;
    created_at: Date;
    options: Option[];
}

export default Poll;