from dotenv import load_dotenv, find_dotenv
from openai import OpenAI
import os

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

api_key = os.environ.get('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)


def get_GPT_query_string(members_house, restrictions):
    house_members = members_house
    members_diet = []
    member_schedule = []
    diet_string = ""
    schedule_string = ""

    for member in house_members:
        match_found = False
        for restriction in restrictions:
            if member == restriction[0]:
                members_diet.append(restriction[1])
                match_found = True
                break
        if not match_found:
            members_diet.append('')

    for member in house_members:
        match_found = False
        for restriction in restrictions:
            if member == restriction[0]:
                member_schedule.append(restriction[2])
                match_found = True
                break
        if not match_found:
            member_schedule.append('')

    for member in house_members:
        if members_diet[house_members.index(member)] != "":
            diet_string += f"{member} does not eat "
            if isinstance(members_diet[house_members.index(member)], list):
                for restriction in members_diet[house_members.index(member)]:
                    diet_string += f"{restriction}, "
            else:
                diet_string += f"{members_diet[house_members.index(member)]}, "
            diet_string = diet_string.rstrip(', ') + '.\n'

    for member in house_members:
        if member_schedule[house_members.index(member)] != "":
            schedule_string += f"{member} is not available "
            if isinstance(member_schedule[house_members.index(member)], list):
                for restriction in member_schedule[house_members.index(member)]:
                    schedule_string += f"{restriction}, "
            else:
                schedule_string += f"{member_schedule[house_members.index(member)]}, "
            schedule_string = schedule_string.rstrip(', ') + '.\n'

    return f"Here are the dietary restrictions: {diet_string}And here are the schedules: {schedule_string}"


def get_openai_weekly_menu(members_house, restrictions):
    menu_string = get_GPT_query_string(members_house, restrictions)
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
