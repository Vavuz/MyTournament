import { Component, AfterViewInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageComponent } from './components/image/image.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { tsParticles } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";
import { InputComponent } from './components/input/input.component';
import { GeminiApiService } from './services/gemini-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageComponent, CommonModule, MatButtonModule, MatIconModule, MatDividerModule, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'MyTournament';
  gameStarted = false;
  shoot = true;
  leftImageUrl = "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x4.jpg";
  rightImageUrl = "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg";
  listOfImages: any[] = [];

  constructor(@Inject(GeminiApiService) private geminiApiService: GeminiApiService) {}

  ngOnInit() {
    this.geminiApiService.getItems("dogs").subscribe(
      (response: any) => {
        try {
          const rawText = response.candidates[0].content.parts[0].text;
          const cleanText = rawText.replace(/```json|```/g, '').trim();
          this.listOfImages = JSON.parse(cleanText);
  
          console.log('Received list:', this.listOfImages);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      },
      (error: any) => {
        console.error('Error fetching list:', error);
      }
    );
  }  

  startGame() {
    this.spinningWheel();
    this.retrieveObjects();
    this.retrieveImages();
    this.gameStarted = true;
    this.startLogic();
  }

  goToHome() {
    this.spinningWheel();
    this.gameStarted = false;
    this.listOfImages = [];
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
    this.loadImages();
    return;
  }

  loadImages() {
    this.shoot = true;
    return;
  }

  async ngAfterViewInit() {
    await loadConfettiPreset(tsParticles);
  }

  shootConfetti(event: MouseEvent) {
    if (this.shoot) {
      const img = event.target as HTMLElement;
      const rect = img.getBoundingClientRect();

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;

      tsParticles.load("tsparticles", {
        preset: "confetti",
        emitters: {
          position: {
            x: xPercent,
            y: yPercent
          },
          rate: {
            quantity: 4,
            delay: 0
          },
          life: {
            duration: 0.3,
            count: 1
          }
        }
      });

      this.shoot = false;
    }
  }
}