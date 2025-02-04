import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageComponent } from './image/image.component';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageComponent, CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyTournament';
  gameStarted = false;
  leftImageUrl ="https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x4.jpg";
  rightImageUrl ="https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg";

  startGame() {
    this.spinningWheel();
    this.retrieveObjects();
    this.retrieveImages();
    this.gameStarted = true;
    this.startLogic();
  }

  spinningWheel() {
    return;
  }

  retrieveObjects() {
    return;
  }

  retrieveImages() {
    return;
  }

  startLogic() {
    return;
  }
}
