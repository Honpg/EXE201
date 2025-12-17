import os

import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core import exceptions as google_exception
from utils import INSTRUCTION

load_dotenv()


def summarize_with_gemini(
    text_to_summarize: str, instruction: str = INSTRUCTION
) -> str:
    """
    Summarizes a given text by calling the Google Gemini API.

    Args:
        text_to_summarize (str): The text content to be summarized.
        instruction (str): A prompt or instruction for the Gemini model.

    Returns:
        str: The summarized text from the API, or a descriptive error message.
    """
    # --- 1. Check for Input Content ---
    if not text_to_summarize or not text_to_summarize.strip():
        return "Error: No content provided for summarization."

    try:
        # --- 2. Configure API Key ---
        # Load the API key from an environment variable for security.
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            return "Error: GOOGLE_API_KEY environment variable not set. Please configure your API key."

        genai.configure(api_key=api_key)

        # --- 3. Set Up the Model ---
        # Define generation configuration for controlling the output.
        generation_config = {
            "temperature": 0.5,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 256,  # Adjust as needed
        }

        # Initialize the Generative Model. 'gemini-1.5-flash-latest' is a fast and cost-effective model.
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash", generation_config=generation_config
        )

        # --- 4. Create the Prompt and Call the API ---
        # Construct the full prompt for the model.
        prompt = f"{instruction}\n\n---\n\n{text_to_summarize}"

        # Generate the content using the model.
        response = model.generate_content(prompt)

        # --- 5. Extract and Return the Summary ---
        summary = response.text.strip()
        return summary

    # --- 6. Handle Potential Errors ---
    except google_exception.PermissionDenied as e:
        print(f"Authentication Error: {e}")
        return "Error: Permission denied. Please check if your API key is correct and has the necessary permissions."
    except google_exception.InvalidArgument as e:
        print(f"Invalid Argument Error: {e}")
        return f"Error: The API request was invalid. This might be due to the content sent. Details: {e}"
    except Exception as e:
        # Catch any other unexpected errors.
        print(f"An unexpected error occurred: {e}")
        return f"An unexpected error occurred during summarization. Details: {e}"


# --- Example Usage ---
if __name__ == "__main__":
    # Example text to be summarized.
    sample_text = """
    The solar system is a gravitationally bound system of the Sun and the objects that orbit it, either directly or indirectly. 
    Of the objects that orbit the Sun directly, the largest are the eight planets, with the remainder being smaller objects, 
    the dwarf planets and small Solar System bodies. Of the objects that orbit the Sun indirectly—the natural satellites—two 
    are larger than the smallest planet, Mercury, and one is larger than the dwarf planet Eris. The solar system formed 4.6 
    billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the 
    system's mass is in the Sun, with most of the remaining mass contained in Jupiter. The four inner system planets—Mercury, 
    Venus, Earth and Mars—are terrestrial planets, being primarily composed of rock and metal. The four outer system planets 
    are giant planets, being substantially more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, 
    being composed mainly of hydrogen and helium; the two outermost planets, Uranus and Neptune, are ice giants, being composed 
    mostly of substances with relatively high melting points compared with hydrogen and helium, called volatiles, such as water, 
    ammonia and methane. All eight planets have almost circular orbits that lie within a nearly flat disc called the ecliptic.
    """

    print("--- Summarizing Sample Text ---")
    summary_result = summarize_with_gemini(sample_text)

    # Print the result in a formatted way.
    print("\n--- ORIGINAL TEXT ---")
    print(sample_text.strip())
    print("\n--- GENERATED SUMMARY ---")
    print(summary_result)

    print("\n\n--- Testing Edge Case: No Input ---")
    error_result = summarize_with_gemini("")
    print(error_result)
