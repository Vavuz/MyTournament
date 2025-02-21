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
import { GeminiApiService } from './services/gemini-api/gemini-api.service';
import { ImageApiService } from './services/image-api/image-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageComponent, CommonModule, MatButtonModule, MatIconModule, MatDividerModule, InputComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'MyTournament';
  gameStarted = false;
  gameLoading = false;
  shoot = true;
  quantity: number = 16;
  category: string = "";
  leftImageUrl = "";
  rightImageUrl = "";
  leftImageName = "";
  rightImageName = "";
  listOfImages: any[] = [];

  constructor(@Inject(GeminiApiService) private geminiApiService: GeminiApiService, private imageApiService: ImageApiService) {}

  startGame() {
    if (!this.category.trim()) {
      alert("Please enter a category first!");
      return;
    }
  
    this.gameLoading = true;
    this.retrieveObjects(this.quantity, this.category);
  }  

  goToHome() {
    this.gameStarted = false;
    this.gameLoading = false;
    this.listOfImages = [];
  }

  retrieveObjects(quantity: number, item: string) {
    this.geminiApiService.getItems(quantity, item).subscribe(
      (response: any) => {
        try {
          const rawText = response.candidates[0].content.parts[0].text;
          const cleanText = rawText.replace(/```json|```/g, '').trim();
          const parsedList = JSON.parse(cleanText);
          
          this.listOfImages = parsedList.map((item: any) => ({
            name: item.name,
            imageUrl: ''
          }));
          
          let imagesLoaded = 0;

          this.listOfImages.forEach(item => {
            this.retrieveImages(item, () => {
              imagesLoaded++;
              if (imagesLoaded === this.listOfImages.length) {
                this.gameLoading = false;
                this.startLogic();
              }
            });
          });

        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      },
      (error: any) => {
        console.error("Error fetching list:", error);
      }
    );
  }

  retrieveImages(item: { name: string; imageUrl: string }, callback: () => void) {
    this.imageApiService.getImageForItem(item.name).subscribe((imageUrl: string) => {
      if (imageUrl) {
        item.imageUrl = imageUrl;
        console.log(imageUrl);
      }
      callback();
    });
  }
  
  startLogic() {
    this.gameStarted = true;
    this.loadImages();
    return;
  }

  loadImages() {
    this.leftImageUrl = this.listOfImages[0].imageUrl;
    this.leftImageName = this.listOfImages[0].name;
    this.rightImageUrl = this.listOfImages[1].imageUrl;
    this.rightImageName = this.listOfImages[1].name;
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

  onCategorySelected(category: string) {
    this.category = category;
  }  
}