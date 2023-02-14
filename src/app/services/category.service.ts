import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {map} from "rxjs";
import {Category} from "../models/category";


@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    // firebase categories collection URL
    private firebaseURL = 'categories'

    constructor(private fireBase: AngularFireDatabase) {
    }

    // read lists of all categories from firebase
    getAllCategories() {
        return this.fireBase.list(this.firebaseURL, query =>
            query.orderByChild('categoryID'))
            .snapshotChanges().pipe(
                map(changes =>
                    changes.map((c: any) => ({key: c.payload.key, ...c.payload.val()})))
            );
    }

    // create category in to firebase
    addCategory(category: Category) {
        return this.fireBase.list<Category>(this.firebaseURL).push(category);
    }

    // U - update category in firebase
    updateCategory(key: string, category: Category) {
        return this.fireBase.list(this.firebaseURL).update(key, category);
    }

    // U - update item categoryID in firebase
    updateCategoryID(key: string, category: number) {
        return this.fireBase.list(this.firebaseURL).update(key, {categoryID: category});
    }

    // delete category from firebase
    removeCategory(key: string) {
        return this.fireBase.list(this.firebaseURL).remove(key);
    }
}
