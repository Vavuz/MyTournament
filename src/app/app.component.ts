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
  roundName = "";
  gameStarted = false;
  gameLoading = false;
  gameEnded = false;
  noTokens = false;
  shoot = true;
  quantity: number = 16;
  category: string = "";
  leftImageUrl: string = "";
  rightImageUrl: string = "";
  leftImageName: string = "";
  rightImageName: string = "";
  winnerImageUrl: string = "";
  winnerImageName: string = "";
  listOfImages: any[] = [];
  imagesToKeep: any[] = [];
  currentRound: number = 1;

  constructor(@Inject(GeminiApiService) private geminiApiService: GeminiApiService, private imageApiService: ImageApiService) {}

  startGame() {
    if (!this.category.trim()) {
      alert("Please enter a category first!");
      return;
    }
  
    this.gameLoading = true;
    this.retrieveObjects(this.quantity, this.category);
  }  

  async ngAfterViewInit() {
    await loadConfettiPreset(tsParticles);
  }

  goToHome() {
    this.roundName = "";
    this.gameStarted = false;
    this.gameLoading = false;
    this.gameEnded = false;
    this.noTokens = false;
    this.shoot = true;
    this.category = "";
    this.leftImageUrl = "";
    this.rightImageUrl = "";
    this.leftImageName = "";
    this.rightImageName = "";
    this.winnerImageUrl = "";
    this.winnerImageName = "";
    this.listOfImages = [];
    this.imagesToKeep = [];
    this.currentRound = 1;
  }

  retrieveObjects(quantity: number, item: string) {
    this.geminiApiService.getItems(quantity, item).subscribe(
      (response: any) => {
        try {
          const rawText = response.candidates[0].content.parts[0].text;
          const match = rawText.match(/\[.*\]/s);
          const cleanText = match[0];
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
        this.gameLoading = false;
        this.noTokens = true;
      }
    );
  }  

  retrieveImages(item: { name: string; imageUrl: string }, callback: () => void) {
    this.imageApiService.getImageForItem(item.name).subscribe(
      (imageUrl: string) => {
        if (imageUrl) {
          item.imageUrl = imageUrl;
        }
        callback();
      },
      err => {
        if (err.status === 429) {
          this.gameLoading = false;
          this.noTokens = true;
        }
        callback();
      }
    );
  }  
  
  startLogic() {
    this.gameStarted = true;
    this.loadImages();
  }

  roundNameChange() {
    switch (this.currentRound) {
      case (1): {
        this.roundName = "Round 1";
        break;
      }
      case (2): {
        this.roundName = "Round 2";
        break;
      }
      case (3): {
        this.roundName = "Round 3";
        break;
      }
      case (4): {
        this.roundName = "Final round!";
        break;
      }
      case (5): {
        this.roundName = "Winner!";
        break;
      }
    }
  }

  loadImages() {
    this.roundNameChange()
    this.shoot = true;
    this.leftImageUrl = this.listOfImages[0].imageUrl;
    this.leftImageName = this.listOfImages[0].name;
    this.rightImageUrl = this.listOfImages[1].imageUrl;
    this.rightImageName = this.listOfImages[1].name;
  }

  async winnerSelected(imageName: string) {
    const matchWinner = this.leftImageName === imageName ? this.listOfImages[0] : this.listOfImages[1];
    this.imagesToKeep.push(matchWinner);

    this.listOfImages.splice(0, 2);

    await new Promise(f => setTimeout(f, 800));
    
    if (this.changeMatchAndRound()) {
      this.loadImages();
    }
    else {
      this.gameEnded = true;
      this.endGame(matchWinner);
    }
  }

  changeMatchAndRound(): boolean {
    if (this.listOfImages.length > 0) {
      return true;
    }
    if (this.listOfImages.length == 0 && this.currentRound !== 4){
      this.currentRound += 1;
      this.listOfImages = this.imagesToKeep;
      this.imagesToKeep = [];
      return true;
    }

    return false;
  }

  nextRound() {
    this.currentRound += 1;
    this.listOfImages = this.listOfImages.filter((item, index) => this.imagesToKeep.includes(index));
    this.imagesToKeep = [];
  }

  endGame(winner: { name: string; imageUrl: string }) {
    this.currentRound += 1;
    this.roundNameChange()
    this.winnerImageUrl = winner.imageUrl;
    this.winnerImageName = winner.name;
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
    }

    if (this.currentRound != 4){
      this.shoot = false;
    }
  }

  onCategorySelected(category: string) {
    this.category = category;
  }  
}