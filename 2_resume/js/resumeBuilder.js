var mySkills = ["Apex", "Visualforce", "SOQL", "HTML", "CSS", "JS", "Java", "SQL", "C"];

var bio = {
    name: "Enrique Garrido Quiroga",
    role: "Software Engineer",
    contacts: {
        mobile: "111111111",
        email: "e.garridoquiroga@gmail.com",
        github: "https://github.com/enriquegq",
        twitter: "",
        linkedIn: "https://www.linkedin.com/in/enriquegarridoquiroga",
        location: 'Krakow, Poland'
    },
    welcomeMessage: "&ldquo;fortis Fortuna iuvat&rdquo;",
    skills: mySkills,
    biopic: "images/me.jpg",
    display: function() {
        var formattedName = HTMLheaderName.replace("%data%", bio.name);
        var formattedRole = HTMLheaderRole.replace("%data%", bio.role);
        var formattedEmail = HTMLemail.replace("%data%", bio.contacts.email);
        var formattedPhone = HTMLmobile.replace("%data%", bio.contacts.mobile);
        var formattedGitHub = HTMLgithub.replace("%data%", bio.contacts.github);
        var formattedLinkedIn = HTMLlinkedIn.replace("%data%", bio.contacts.linkedIn);
        var formattedPic = HTMLbioPic.replace("%data%", bio.biopic);
        var formattedWelcomeMsg = HTMLwelcomeMsg.replace("%data%", bio.welcomeMessage);

        $("#header").prepend(formattedRole);
        $("#header").prepend(formattedName);
        // $("#header").append(formattedPic);
        $("#header").append(formattedWelcomeMsg);

        var formattedSkill = "";
        if (bio.skills.length > 0) {
            $("#bioSkills").append(HTMLskillsStart);
            bio.skills.forEach(function(skill) {
                formattedSkill = HTMLskills.replace("%data%", skill);
                $("#skills").append(formattedSkill);
            });
            formattedSkill = "";
        }

        $("#footerContacts").prepend(formattedGitHub);
        $("#footerContacts").prepend(formattedLinkedIn);
        $("#footerContacts").prepend(formattedEmail);
        $("#footerContacts").prepend(formattedPhone);
    }
};

var education = {
    "schools": [{
        "name": "University of A Coruna",
        "location": "A Coruna, Spain",
        "degree": "5 year Bachelor",
        "majors": ["Computer Engeneering"],
        "dates": "2005 - 2013",
        "url": "http://www.fic.udc.es"
    }, {
        "name": "University of Cyprus",
        "location": "Nicosia, Cyprus",
        "degree": "Erasmus programme",
        "majors": ["Computer Science"],
        "dates": "2010 - 2011",
        "url": "http://www.ucy.ac.cy/en/"
    }],
    "onlineCourses": [{
        "title": "Front End Web Developer Nanodegree",
        "school": "Udacity",
        "dates": "June 2016 - now",
        "url": "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001",
        "description": "HTML + CSS + JS"
    }],
    display: function() {
        var formattedSchool, formattedDegree, formattedDate, formattedLocation,
            formattedMajor;
        var formattedCourse, formattedCourseSchool, formattedCourseDates,
            formattedCourseDesc;
        education.schools.forEach(function(school) {
            formattedSchool = HTMLschoolName.replace("%data%", school.name);
            formattedSchool = formattedSchool.replace("%url%", school.url);
            formattedDegree = HTMLschoolDegree.replace("%data%", school.degree);
            formattedDate = HTMLschoolDates.replace("%data%", school.dates);
            formattedLocation = HTMLschoolLocation.replace("%data%", school.location);
            formattedMajor = HTMLschoolMajor.replace("%data%", school.majors);
            $("#education").append(HTMLschoolStart);
            $(".education-entry:last").append(formattedSchool + formattedDegree);
            $(".education-entry:last").append(formattedDate);
            $(".education-entry:last").append(formattedLocation);
            $(".education-entry:last").append(formattedMajor);
        });
        education.onlineCourses.forEach(function(course) {
            formattedCourse = HTMLonlineTitle.replace("%data%", course.title);
            formattedCourse = formattedCourse.replace("%url%", course.url);
            formattedCourseSchool = HTMLonlineSchool.replace("%data%", course.school);
            formattedCourseDates = HTMLonlineDates.replace("%data%", course.dates);
            formattedCourseDesc = HTMLonlineDescription.replace("%data%", course.description);
            $("#education").append(HTMLonlineClasses);
            $("#education").append(HTMLschoolStart);
            $(".education-entry:last").append(formattedCourse + formattedCourseSchool);
            $(".education-entry:last").append(formattedCourseDates);
            $(".education-entry:last").append(formattedCourseDesc);
        });
    }
};

var work = {
    "jobs": [{
        "employer": "GE Healthcare",
        "title": "Software Engineer (SFDC developer)",
        "location": "Krakow, Poland",
        "dates": "Mar 2015 - now",
        "description": "Part of a team located in different regions all over the globe, responsible for " +
            "the development of a worldwide solution for sales. Code base customizations, " +
            "integrations with other systems through web services and design analysis of " +
            "new requirements are the main tasks I accomplish."
    }, {
        "employer": "Craftware",
        "title": "Jr. Software Engineer (SFDC developer)",
        "location": "Warsaw, Poland",
        "dates": "Jan 2014 - Feb 2015",
        "description": "Salesforce.com developer working as a contractor for the client Hoffmann-La " +
            "Roche. Responsible for the development of several modules in a CRM project " +
            "for Latin America countries. Standard and service cloud console requirements " +
            "implemented effectively with standard and non-standard salesforce technologies (e.g. Angular JS)."
    }, {
        "employer": "Cyprus Community Media Centre",
        "title": "Summer Intern",
        "location": "Nicosia, Cyprus",
        "dates": "Jun 2011 - Jul 2011",
        "description": "Responsible for several computer and Internet related tasks to help the CCMC " +
            "video production unit to better display its productions to wider audience. " +
            "Thereby CCMC can subtitle all its video productions into the local languages " +
            "of Cyprus and publish them on the official site and the official channel on " +
            "YouTube."
    }],
    display: function() {
        var formattedEmployer, formattedPosition, formattedDate, formattedLocation,
            formattedDescription;
        work.jobs.forEach(function(job) {
            formattedEmployer = HTMLworkEmployer.replace("%data%", job.employer);
            formattedPosition = HTMLworkTitle.replace("%data%", job.title);
            formattedDate = HTMLworkDates.replace("%data%", job.dates);
            formattedLocation = HTMLworkLocation.replace("%data%", job.location);
            formattedDescription = HTMLworkDescription.replace("%data%", job.description);

            $("#workExperience").append(HTMLworkStart);
            $(".work-entry:last").append(formattedEmployer + formattedPosition);
            $(".work-entry:last").append(formattedDate);
            $(".work-entry:last").append(formattedLocation);
            $(".work-entry:last").append(formattedDescription);
        });
    }
};

var projects = {
    projects: [{
        "title": "Resume",
        "dates": "Nov 16",
        "description": "[FEND Nanodegree] Second project, using HTML, CSS and JS. " +
            "Creating a resume online using JS objects to store the data. ",
        "images": [],
        "url": ""
    }, {
        "title": "Product Portfolio",
        "dates": "Oct 16",
        "description": "[FEND Nanodegree] First project, using HTML and CSS. " +
            "The main goal was to get confortable with the technologies and accomplish a fully responsive page. ",
        "images": ["images/project1.1-mini.png", "images/project1.2-mini.png"],
        "url": "https://enriquegq.github.io/fend/1_portfolio_project/"
    }],
    display: function() {
        var formattedProject, formattedProjDates, formattedProjDesc;
        projects.projects.forEach(function(project) {
            formattedProject = HTMLprojectTitle.replace("%data%", project.title);
            formattedProject = formattedProject.replace("%url%", project.url);
            formattedProjDates = HTMLprojectDates.replace("%data%", project.dates);
            formattedProjDesc = HTMLprojectDescription.replace("%data%", project.description);
            $("#projects").append(HTMLprojectStart);
            $(".project-entry:last").append(formattedProject);
            $(".project-entry:last").append(formattedProjDates);
            $(".project-entry:last").append(formattedProjDesc);

            if (project.images.length > 0) {
                project.images.forEach(function(image) {
                    $(".project-entry:last").append(HTMLprojectImage.replace("%data%", image));
                });
            }
        });
    }
};

bio.display();
education.display();
work.display();
projects.display();

$("#mapDiv").append(googleMap);