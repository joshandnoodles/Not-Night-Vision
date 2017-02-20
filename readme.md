# Not Night Vision

Single-Pixel Thermal Imaging Solution Using PIC24EP and MLX90614

*Additional documentation (background and analysis of system) can be found in the following documents:
  - [](doc/Proposal.md)
  - [](doc/Design.md)

## Structure

  - **/app** 
    - Chrome App source code files for debug interface
  - **/doc**
    - all documentation relating to the development of the system
    - preliminary research of high-level design (feasibility studies, calculation notes, block diagrams, preliminary component selection tasks)
    - design verification test of system (rework diagrams, board tracking, next generation revision notes, validation test data)
    - **/datasheets**
      - datasheets, user-guides, schematics, and layout files for vendor components
  - **/firmware** *-placeholder-*
    - MCU firmware source code files and libraries
  - **/schema**
    - board schematic files
    - board layout files
  
## Installation

This application requires the use of Chrome Apps to present a meaningful interaction endpoint to the user. With the Chrome App interface already installed (see below for Chrome App installation instructions), minimal setup is required. Connect the Not Night Vision PCB to the USB port of the PC. The PCB will power up and polling will begin without any user intervention. 
 
A preliminary installation step may be necessary if the Chrome App interface is not already installed on the PC. The source code files are located in the /app directory. Google Chrome must be installed on the PC endpoint wishing to operate the interface. With Chrome open, follow the steps to access the Chrome App debug:
  - Open Chrome and go to **Menu > (More) Tools > Extensions**
  - Click **Developer mode > Load unpacked extensions...**
  - Browse to and **Select** the **/app** directory
  - Click **Launch**
