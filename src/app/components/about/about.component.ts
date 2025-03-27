import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Amanda Gibertoni',
      role: 'UX/UI Designer',
      image: 'assets/amanda_logo.png',
      description: 'UX/UI Designer with 1+ year of experience in creating intuitive and visually engaging digital experiences, focusing on user-centered design, wireframing, prototyping, and usability testing. Skilled in designing responsive interfaces, improving user flows, and collaborating with cross-functional teams to deliver seamless experiences. Passionate about solving problems through design and always strive to enhance accessibility and user satisfaction.'
    },
    {
      name: 'Cristian Iamadrid',
      role: 'Software Developer',
      image: 'assets/cristian_logo.jpg',
      description: 'Software Developer with over 3 years of experience designing, developing, and testing web applications, testing such as functional testing, regression testing, load testing, performance testing and so on. Skilled in building efficient, user-friendly interfaces and scalable backend solutions. Proficient in JavaScript frameworks such as Angular, React, and Bootstrap, with hands-on expertise in backend technologies including Node.js, Express.js, and MongoDB. Motivated with commitment to achieve client expectations'
    },
    {
      name: 'Ernesto Castillo',
      role: 'Software Developer',
      image: 'assets/ernesto.jpg',
      description: 'Software Developer with over 3 years of experience designing, developing, and testing web applications, testing such as functional testing, regression testing, load testing, performance testing and so on. Skilled in building efficient, user-friendly interfaces and scalable backend solutions. Proficient in JavaScript frameworks such as Angular, React, and Bootstrap, with hands-on expertise in backend technologies including Node.js, Express.js, and MongoDB. Motivated with commitment to achieve client expectations'
    },
    {
      name: 'Jose Antonio',
      role: 'Software Developer',
      image: 'assets/jaco_logo.jpg',
      description: 'Software Developer with over 3 years of experience designing, developing, and testing web applications, testing such as functional testing, regression testing, load testing, performance testing and so on. Skilled in building efficient, user-friendly interfaces and scalable backend solutions. Proficient in JavaScript frameworks such as Angular, React, and Bootstrap, with hands-on expertise in backend technologies including Node.js, Express.js, and MongoDB. Motivated with commitment to achieve client expectations'
    },
    {
      name: 'Viviana Saldarriaga',
      role: 'Software Developer',
      image: 'assets/viviana.jpg',
      description: 'Software Developer with over 3 years of experience designing, developing, and testing web applications, testing such as functional testing, regression testing, load testing, performance testing and so on. Skilled in building efficient, user-friendly interfaces and scalable backend solutions. Proficient in JavaScript frameworks such as Angular, React, and Bootstrap, with hands-on expertise in backend technologies including Node.js, Express.js, and MongoDB. Motivated with commitment to achieve client expectations'
    }
  ];
}
