import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        username: string;
        email: string;
    };
}
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(req: RequestWithUser, createCategoryDto: CreateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    findAll(req: RequestWithUser): Promise<import("./schemas/category.schema").Category[]>;
    getTaskCounts(req: RequestWithUser): Promise<any>;
    findOne(req: RequestWithUser, id: string): Promise<import("./schemas/category.schema").Category>;
    update(req: RequestWithUser, id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    remove(req: RequestWithUser, id: string): Promise<void>;
}
export {};
