import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { RxHeroDocument } from '../RxDB';
import { DatabaseService } from '../rxdbfactory';

@Component({
  selector: 'app-hero-insert',
  templateUrl: './hero-insert.component.html',
  styleUrls: ['./hero-insert.component.css'],
  providers: [DatabaseService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroInsertComponent {

  @ViewChild('input', { static: false }) inputfield: any;


  tempDoc: any;

  constructor(
    private dbService: DatabaseService
  ) {
    this.reset();
  }

  reset() {
    this.tempDoc = this.dbService.db.hero.newDocument({
      maxHP: getRandomArbitrary(100, 1000)
    });
    this.dbService.db.hero.findOne({
      selector: {
        name: 'dfd'
      }
    }).exec().then(doc => console.dir(doc?.name));
  }

  async submit() {
    debugger;
    console.log('HeroInsertComponent.submit():');
    console.log('name: ' + this.tempDoc.name);
    console.log('color: ' + this.tempDoc.color);

    try {
      await this.tempDoc.save();
      this.reset();
      
    } catch (err) {
      alert('Error: Please check console');
      console.error('hero-insert.submit(): error:');
      throw err;
    }

    this.inputfield.nativeElement.focus();
  }
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * @link https://stackoverflow.com/a/1527820/3443137
 */
function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}


