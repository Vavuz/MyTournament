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
import { PexelsApiService } from './services/pexels-api/pexels-api.service';

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
  quantity: number = 16;
  category: string = "";
  leftImageUrl = "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x4.jpg";
  rightImageUrl = "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg";
  listOfImages: any[] = [];

  constructor(@Inject(GeminiApiService) private geminiApiService: GeminiApiService, private pexelsApiService: PexelsApiService) {}

  startGame() {
    if (!this.category.trim()) {
      alert("Please enter a category first!");
      return;
    }
  
    this.spinningWheel();
    this.retrieveObjects(this.quantity, this.category);
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
  
          this.listOfImages.forEach(item => {
            this.retrieveImages(item);
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

  retrieveImages(item: { name: string; imageUrl: string }) {
    this.pexelsApiService.getImageForItem(item.name).subscribe((imageUrl: string) => {
      if (imageUrl) {
        console.log(`Image found for ${item.name}: ${imageUrl}`);
        item.imageUrl = imageUrl;
      } else {
        console.warn(`No image found for ${item.name}`);
        item.imageUrl = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
      }
    });
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

  onCategorySelected(category: string) {
    this.category = category;
  }  
}