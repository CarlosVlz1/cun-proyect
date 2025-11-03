import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private categoryModel;
    private readonly logger;
    constructor(categoryModel: Model<CategoryDocument>);
    create(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(userId: string): Promise<Category[]>;
    findOne(userId: string, id: string): Promise<Category>;
    update(userId: string, id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(userId: string, id: string): Promise<void>;
    getTaskCounts(userId: string): Promise<any>;
}
