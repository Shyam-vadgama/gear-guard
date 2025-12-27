# ==============================================================================
# REAL-TIME BARCODE SCANNER
# ==============================================================================
#
# DESCRIPTION:
# A complete, single-file Python application that uses a webcam to scan barcodes
# in real-time, extracts the serial number, and provides several bonus features.
#
# REQUIREMENTS:
# - Python 3.x
# - OpenCV
# - pyzbar
# - python-barcode (for generating test barcodes)
#
# INSTALLATION:
# Open your terminal or command prompt and run the following commands:
#
# pip install opencv-python
# pip install pyzbar
# pip install python-barcode
#
# For Windows, you may also need to install the Visual C++ Redistributable.
# The pyzbar library also requires a system-level ZBar installation on some
# non-Windows systems. For Windows, the included DLLs in pyzbar often work
# out-of-the-box.
#
# ==============================================================================

import cv2
from pyzbar.pyzbar import decode
import os
import random
import string
import winsound  # For making a beep sound on Windows
from barcode import get_barcode_class
from barcode.writer import ImageWriter

# --- CONFIGURATION ---

# File to save scanned serial numbers
SCANNED_SERIALS_FILE = "scanned_serials.txt"
# Directory to save test barcode images
TEST_BARCODES_DIR = "barcode_test_images"
# Beep sound settings (Frequency in Hz, Duration in ms)
BEEP_FREQ = 1000
BEEP_DURATION = 100

def generate_test_barcodes(count=10, barcode_type='code128'):
    """
    Generates random serial numbers and saves them as barcode images for testing.

    Args:
        count (int): The number of test barcodes to generate.
        barcode_type (str): The type of barcode to generate (e.g., 'code128', 'ean13').
    """
    print(f"--- Generating {count} Test Barcodes ---")
    
    # Ensure the output directory exists
    if not os.path.exists(TEST_BARCODES_DIR):
        os.makedirs(TEST_BARCODES_DIR)
        print(f"Created directory: {TEST_BARCODES_DIR}")

    # Get the barcode class from the 'python-barcode' library
    try:
        barcode_class = get_barcode_class(barcode_type)
    except:
        print(f"Error: Invalid barcode type '{barcode_type}'. Defaulting to 'code128'.")
        barcode_type = 'code128'
        barcode_class = get_barcode_class(barcode_type)
        
    for i in range(count):
        # Generate a random serial number
        if barcode_type == 'ean13':
            # EAN-13 requires 12 digits (13th is a checksum)
            serial_number = ''.join(random.choices(string.digits, k=12))
        else:
            # CODE128 can handle alphanumeric characters
            serial_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

        try:
            # Create the barcode object
            barcode_obj = barcode_class(serial_number, writer=ImageWriter())
            
            # Define the file path
            filepath = os.path.join(TEST_BARCODES_DIR, f"{serial_number}")
            
            # Save the barcode image (as PNG)
            barcode_obj.save(filepath, options={'write_text': True})
            
            print(f"[{i+1}/{count}] Generated: {serial_number}.png")

        except Exception as e:
            print(f"Error generating barcode for '{serial_number}': {e}")
            
    print("--- Test Barcode Generation Complete ---")


def scan_barcodes():
    """
    Initializes the webcam and starts the real-time barcode scanning process.
    """
    # Use a set to store found serial numbers for quick lookups and to avoid duplicates
    found_serials = set()

    # Open the file to save serial numbers in append mode
    # The 'with' statement ensures the file is properly closed
    with open(SCANNED_SERIALS_FILE, "a") as file:
        
        # Initialize the webcam
        # The argument '0' usually refers to the default built-in webcam
        print("Initializing webcam...")
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("Error: Could not open webcam.")
            return
            
        print("Webcam initialized. Starting real-time scanning...")
        print("Press 'Q' to exit.")

        # Main loop to capture frames and process them
        while True:
            # Read a frame from the webcam
            success, frame = cap.read()
            if not success:
                print("Error: Failed to capture frame. Exiting...")
                break

            # Decode barcodes from the current frame
            # The 'decode' function can find multiple barcodes in one frame
            decoded_objects = decode(frame)

            for obj in decoded_objects:
                # Extract the raw data (serial number)
                # The data is in bytes, so we decode it to a string
                serial_number = obj.data.decode("utf-8")

                # Check if this serial number has been seen before
                if serial_number not in found_serials:
                    # If it's a new serial number:
                    
                    # 1. Print it to the terminal
                    print(f"SCANNED: {serial_number}")

                    # 2. Add it to our set of found serials
                    found_serials.add(serial_number)

                    # 3. Save it to the text file
                    file.write(serial_number + "\n")
                    
                    # 4. Make a beep sound (BONUS)
                    try:
                        winsound.Beep(BEEP_FREQ, BEEP_DURATION)
                    except Exception as e:
                        print(f"Warning: Could not play beep sound. {e}")


                # --- Draw visuals on the frame ---

                # 1. Draw a bounding box around the barcode (BONUS)
                # 'obj.rect' gives the (x, y, width, height) of the bounding box
                (x, y, w, h) = obj.rect
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                # 2. Put the serial number text on the video frame
                cv2.putText(
                    frame, 
                    serial_number, 
                    (x, y - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 
                    0.7, 
                    (0, 255, 0), 
                    2
                )

            # Display the resulting frame in a window
            cv2.imshow("Real-time Barcode Scanner", frame)

            # Wait for 1 millisecond, and check if the 'q' key was pressed
            if cv2.waitKey(1) & 0xFF == ord("q"):
                print("Exit key pressed. Shutting down.")
                break

        # When the loop ends, release the camera and destroy all windows
        cap.release()
        cv2.destroyAllWindows()
        print("Scanner stopped.")


if __name__ == "__main__":
    # --- Step 1: Generate Test Barcodes (Optional) ---
    # Uncomment the line below if you want to generate a fresh set of
    # barcode images for testing purposes. You can then point your
    # webcam at these images on your screen or on a printout.
    
    # generate_test_barcodes(count=10, barcode_type='code128')

    # --- Step 2: Start the Real-time Scanner ---
    # This is the main function that activates the webcam.
    
    scan_barcodes()
