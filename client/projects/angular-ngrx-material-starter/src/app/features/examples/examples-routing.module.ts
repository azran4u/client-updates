import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParlamentContainerComponent } from '../parlament/containers/parlament-container.component';

const routes: Routes = [
  {
    path: '',
    component: ParlamentContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
