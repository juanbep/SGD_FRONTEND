import { RouterModule, Routes } from "@angular/router";
import { HistoricalConsolidatedComponent } from "./pages/historical-consolidated/historical-consolidated.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


export const routes: Routes = [
    {
        path: '',
        component: HistoricalConsolidatedComponent
    }
]
@NgModule({
    declarations: [],
    imports:[
        RouterModule.forChild(routes),
        CommonModule
    ],
    exports:[
        RouterModule
    ]   
})

export class HistoricalRoutingModule { }