from dotenv import load_dotenv, find_dotenv
from openai import OpenAI
import os

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

api_key = os.environ.get('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)


def get_GPT_query_string(members_house, diet_members, schedule_members):
    house_members = members_house
    members_diet = diet_members
    member_schedule = schedule_members

    diet_string = ""
    schedule_string = ""

    for i in house_members:
        diet_string += f"{i} does not eat "
        for j in members_diet[i]:
            diet_string += f"{j}, "

    for i in house_members:
        schedule_string += f"{i} has a class at "
        for j in member_schedule[i]:
            schedule_string += f"{j}, "
        schedule_string += "and should not be expected to cook dinner that night. "

    return f"Here are the dietary restrictions: {diet_string}And here are the schedules: {schedule_string}"


def get_openai_weekly_menu(members_house, diet_members, schedule_members):
    menu_string = get_GPT_query_string(members_house, diet_members, schedule_members)
    house_members = members_house

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system",
             "content": "This is being used on a website to help roommates organize weekly chores."
                        "Part of this is deciding when and what meals are prepared."
                        "People will have varying schedules and dietary restrictions."
                        "The goal is to make a plan that is fair and efficient for everyone."
                        "The meals should be healthy and affordable. Representative of what college student could buy, cooke and eat."
                        "You do not have to restrict yourself to only meals which have none of the ingredients that someone will not eat,"
                        "simply make note of this in the plan, and inform the chef to not include that ingredient in the meal."
                        "For example, if someone does not eat onions, you can still make meatloaf, but the chef should not include onions in the meatloaf."
                        "Also people have different schedules, however still have responsibilities to the house."
                        "For example, if someone has a class at 6pm, they should not be expected to cook dinner that night."},
            {"role": "user",
             "content": f"There are {len(house_members)} people in the house. We need to plan 7 meals for the week, with a total of {len(house_members) * 7} servings."
                        f"{menu_string}"
                        f"Please provide a weekly menu plan for these roommates."},
        ]
    )

    return completion.choices[0].message
