import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from "./models/category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {CategoryService} from "./services/category.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    categories$: Category[] = [];
    categoryForm!: FormGroup;
    categorySubscription!: Subscription;

    isLoading: boolean = true;
    refresh: boolean = true;
    firebase: boolean = false;

    constructor(private categoryService: CategoryService,
                private formBuilder: FormBuilder,
                private toast: MatSnackBar) {
    }

    ngOnInit() {
        this.buildCategoryForm();
        this.loadProductCategory();
    }

    private loadProductCategory() {
        this.isLoading = true;
        this.categorySubscription = this.categoryService.getAllCategories().subscribe(category => {
            this.categories$ = category;
            this.categoryFormUpdate(category.length);
            this.isLoading = false;
        });
    }

    private buildCategoryForm(): void {
        this.categoryForm = this.formBuilder.group({
            categoryID: [0],
            categoryName: ['', {
                validators: [
                    Validators.required, Validators.minLength(3), Validators.maxLength(15)]
            }],
        });
    }

    get categoryID() {
        return this.categoryForm.controls['categoryID'];
    }

    get categoryName() {
        return this.categoryForm.controls['categoryName'];
    }

    private categoryFormUpdate(categoriesLength: number): void {
        this.categoryID.setValue(categoriesLength);
    }

    addCategory() {
        this.categoryService.addCategory(this.categoryForm.value).then(() => {
            this.toast.open('Success - Category created', '', {panelClass: 'toast-success'});
            this.categoryName.setValue('');
        })
            .catch(() => this.toast.open('Error - Something went wrong!',
                '', {panelClass: 'toast-error'}));
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.categories$, event.previousIndex, event.currentIndex);
        this.updateCategoryList(this.refresh);
    }

    updateCategoryList(refresh: boolean) {
        for (let i = 0; i < this.categories$.length; i++) {
            this.categoryService.updateCategoryID(this.categories$[i].key, i).then();
        }
        if (refresh) this.loadProductCategory();
    }

    deleteCategory(key: string) {
        this.categoryService.removeCategory(key).then(() => this.updateCategoryList(this.refresh));
    }

    ngOnDestroy() {
        this.categorySubscription.unsubscribe();
    }
}
