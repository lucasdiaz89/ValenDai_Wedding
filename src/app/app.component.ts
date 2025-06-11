import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import Lenis from '@studio-freight/lenis';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  // Corregí de styleUrl a styleUrls
  standalone: true,
  imports: [FormsModule]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'DaiValen_Wedding';
  private lenis: any;
  private animationFrame: any;
  private countdownInterval: any;
  nombre: string = '';
  invitados: number | null = null;
  ngAfterViewInit() {
    this.lenis = new Lenis({
      smoothWheel: true
    });
    const raf = (time: number) => {
      this.lenis.raf(time);
      this.animationFrame = requestAnimationFrame(raf);
    };
    this.animationFrame = requestAnimationFrame(raf);

    this.startCountdown();

    setTimeout(() => {
      document.querySelector('.presentacion-nombres')?.classList.add('visible');
      setTimeout(() => {
        document.querySelector('.presentacion-frase')?.classList.add('visible');
      }, 200);
    }, 100);

    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.5 });
    cards.forEach((card) => observer.observe(card));
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.lenis) {
      this.lenis.destroy();
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    const targetDate = new Date('2026-02-28T21:00:00');

    this.countdownInterval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
          countdownEl.innerText = '¡Llegó el gran día!';
        }
        clearInterval(this.countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
  }
  confirmarAsistencia(event: Event): void {
    event.preventDefault();
    let mensaje = '';

    if (!this.nombre || this.invitados == null) return;

    if (this.invitados <= 1) {
      mensaje = `Hola Chicos, confirmo mi asistencia. ${this.nombre}`;
    } else {
      mensaje = `Hola Chicos, confirmo mi asistencia. ${this.nombre} y el de ${this.invitados - 1} más.`;
    }

    this.enviarWhatsApp(mensaje);
  }
  noAsistire(): void {
    if (!this.nombre || this.invitados == null) return;

    let mensaje = '';
    if (this.invitados <= 1) {
      mensaje = `Hola Chicos, No podré asistir. Gracias por la invitación, muchas felicidades ${this.nombre}`;
    } else {
      mensaje = `Hola Chicos, no podremos asistir. Gracias por la invitación, muchas felicidades ${this.nombre}`;
    }

    this.enviarWhatsApp(mensaje);
  }

  enviarWhatsApp(mensaje: string): void {
    const numero = '3512263396';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}
